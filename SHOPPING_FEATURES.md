# LiveKit Meet - Shopping Platform Features

## Overview

LiveKit Meet has been transformed into a live shopping platform with real-time product pinning, host role enforcement, viewer reactions, and flash sale capabilities.

## Features

### 1. Role-Based Access Control

**Host Role:**

- Can pin products for all viewers to see
- Can start flash sales with time-limited discounts
- Has `canUpdateOwnMetadata` permission enforced via token
- Identified by server-side token verification

**Viewer Role:**

- Can see pinned products
- Can send reactions (❤️ 🔥 👍 😮 🛒)
- Can dismiss product overlays (doesn't affect other viewers)
- Cannot modify shared shopping state

### 2. Product Pinning via Participant Attributes

**How it works:**

- Hosts use `localParticipant.setAttributes()` to pin a product
- All participants automatically receive updates via `ParticipantAttributesChanged` event
- New joiners immediately see the current pinned product
- Product data (only ID) is stored in `pinnedProduct` attribute

**Attribute Structure:**

```typescript
{
  productId: string; // Product ID from catalog
  pinnedAt: number; // Timestamp
}
```

### 3. Real-Time Data Channels

**Reaction System:**

- Topic: `shopping:reaction`
- Reliability: Unreliable (UDP-like, faster)
- Throttling: 500ms minimum between reactions
- Auto-dismiss: 3.5 seconds after showing

**Flash Sale System:**

- Topic: `shopping:flash-sale`
- Reliability: Reliable (guaranteed delivery)
- Features:
  - Time-limited discount announcements
  - Countdown timer
  - Auto-dismiss when expires

### 4. UI Components

#### ProductOverlay

- Floating overlay showing pinned product
- Positioned bottom-left
- Displays: image, name, description, price, discount, stock status
- "Add to Cart" button links to cart URL
- Viewers can dismiss (host cannot)

#### ProductCarousel

- Host-only component
- Bottom-center toggle panel
- Grid of products from catalog
- Actions:
  - 📌 Pin product for viewers
  - ⚡ Start flash sale
- Visual indicators for pinned products

#### ReactionBar

- Positioned bottom-right
- 5 reaction buttons: ❤️ 🔥 👍 😮 🛒
- Animated floating reactions (3.5s duration)
- Supports up to 30 concurrent reactions

#### FlashSaleBanner

- Positioned top-center
- Gradient background with lightning icon
- Shows product name, discount %, countdown timer
- Auto-dismiss when timer expires

### 5. Product Catalog

Located in `lib/shopping/products.ts`, includes 6 sample products:

| ID       | Name                                 | Price   | Category    | Stock            |
| -------- | ------------------------------------ | ------- | ----------- | ---------------- |
| prod-001 | Wireless Noise-Cancelling Headphones | $199.99 | Electronics | 47               |
| prod-002 | Minimalist Leather Watch             | $149.00 | Accessories | 12               |
| prod-003 | Portable Bluetooth Speaker           | $79.99  | Electronics | 85               |
| prod-004 | Organic Cotton Tote Bag              | $24.99  | Lifestyle   | 200              |
| prod-005 | Smart Fitness Tracker                | $89.99  | Electronics | 33               |
| prod-006 | Scented Soy Candle Set               | $39.99  | Lifestyle   | 0 (out of stock) |

**Product Schema:**

```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;     // For showing discount %
  imageUrl: string;
  category: string;
  inStock: boolean;
  stockCount?: number;         // Shows "Only X left!" if ≤ 20
  cartUrl: string;             // External cart integration
  badge?: string;              // "Best Seller", "New", "Limited"
}
```

## Technical Architecture

### Backend Changes

**Token Generation (`app/api/connection-details/route.ts`):**

- Accepts `role` query parameter (`host` or `viewer`)
- Host tokens receive `canUpdateOwnMetadata: true`
- Permission enforced server-side via LiveKit VideoGrant

```typescript
const grant: VideoGrant = {
  room: roomName,
  roomJoin: true,
  canPublish: true,
  canPublishData: true,
  canSubscribe: true,
  canUpdateOwnMetadata: isHost, // Only hosts
};
```

### Frontend Architecture

**Hooks (`lib/hooks/`):**

1. `useHost.ts`
   - Detects if current user is host
   - Checks `localParticipant.permissions?.canUpdateMetadata`

2. `useShoppingState.ts`
   - Manages pinned product state
   - Listens for `ParticipantAttributesChanged` events
   - Provides `pinProduct()` and `unpinProduct()` methods

3. `useReactions.ts`
   - Manages reaction state
   - Subscribes to `DataReceived` events (topic: `shopping:reaction`)
   - Provides `sendReaction()` method with throttling

4. `useFlashSale.ts`
   - Manages flash sale state
   - Subscribes to `DataReceived` events (topic: `shopping:flash-sale`)
   - Provides `announceFlashSale()` method

**Components (`lib/components/`):**

1. `ShoppingVideoConference.tsx` - Main wrapper integrating all features
2. `ProductOverlay.tsx` - Product display overlay
3. `ProductCarousel.tsx` - Host product selector
4. `ReactionBar.tsx` - Viewer reaction buttons
5. `FlashSaleBanner.tsx` - Flash sale announcement

**Pre-Join Flow (`app/rooms/[roomName]/PageClientImpl.tsx`):**

- Added role selector (Viewer / Host)
- Role sent to API for token generation
- Styles in `styles/Shopping.module.css`

## Styling

All shopping-specific styles in `styles/Shopping.module.css`:

- **Role Selector**: Styled buttons with active state highlighting
- **Product Overlay**: Glassmorphism effect, slide-in animation
- **Reaction Bar**: Floating animation, circular buttons
- **Flash Sale Banner**: Gradient background, drop-in animation
- **Product Carousel**: Grid layout, collapsible panel, hover effects

## Usage Examples

### Host Workflow

1. **Start a meeting** as Host
2. **Open Product Carousel** (bottom-center button)
3. **Browse products** and click "📌 Pin" to display
4. **Start flash sale** by clicking "⚡ Flash" on any product
5. **Unpin product** by clicking "📌 Unpin" when done

### Viewer Workflow

1. **Join a meeting** as Viewer
2. **See pinned products** in overlay (bottom-left)
3. **Send reactions** using buttons (bottom-right)
4. **View flash sales** in banner (top-center)
5. **Add to cart** by clicking button in overlay

## API Integration

### External Cart System

The `cartUrl` in product data can be configured for external integration:

```typescript
// Example: Shopify integration
cartUrl: 'https://shop.example.com/cart/add?id=123456';

// Example: Custom API
cartUrl: '/api/cart/add?productId=prod-001';
```

### Product Data

Currently using hardcoded catalog. To integrate with external API:

```typescript
// In lib/shopping/products.ts
export async function fetchProductCatalog(): Promise<Product[]> {
  const response = await fetch(process.env.PRODUCT_API_URL);
  return response.json();
}
```

## Security Considerations

1. **Server-side enforcement**: Host role is enforced via token permissions
2. **Permission checks**: Client-side checks verify permissions before actions
3. **Data validation**: All data channel messages are validated
4. **Rate limiting**: Reactions throttled to prevent spam
5. **Attribute limits**: Participant attributes have size limits

## Scalability

1. **Participant attributes**: Used for persistent state (scales to 10K+ participants)
2. **Data channels**: Used for ephemeral updates (scales to 100K+ participants)
3. **Optimizations**:
   - Reactions use unreliable delivery (faster, less bandwidth)
   - Flash sales use reliable delivery (guaranteed)
   - Max 30 concurrent reactions displayed (UI optimization)

## Future Enhancements

1. **Product search/filter**: Add search box to carousel
2. **Stock updates**: Real-time stock updates via data channels
3. **Purchase analytics**: Track clicks, reactions, engagement
4. **Multi-host support**: Allow multiple hosts to pin products
5. **Custom badges**: Dynamic badges based on flash sales
6. **Product categories**: Filter products by category
7. **Analytics dashboard**: Host view of engagement metrics
8. **Shopping cart preview**: Show cart contents in overlay

## Troubleshooting

**Issue: Cannot see pinned products**

- Check that user has host permission
- Verify participant attributes are being set
- Check browser console for errors

**Issue: Reactions not appearing**

- Verify data channel is working
- Check that topic matches: `shopping:reaction`
- Ensure participant has `canPublishData` permission

**Issue: Flash sale not showing**

- Verify host permission
- Check data channel topic: `shopping:flash-sale`
- Ensure timer duration is valid (positive number)

**Issue: Role selector not working**

- Verify API endpoint is receiving `role` parameter
- Check that token includes `canUpdateOwnMetadata` for hosts
- Ensure environment variables are set

## Environment Variables

No additional variables required. Uses existing LiveKit variables:

- `LIVEKIT_URL` - LiveKit server URL
- `LIVEKIT_API_KEY` - API key for token generation
- `LIVEKIT_API_SECRET` - API secret for token generation

Optional for future integrations:

- `PRODUCT_API_URL` - External product catalog API
- `CART_API_URL` - External cart API
