# Manual GraphQL Queries to Add Dummy Shipping Method

## Step 1: Get Available Channels

```graphql
query GetChannels {
	channels {
		id
		name
		slug
		currencyCode
		defaultCountry {
			code
			country
		}
	}
}
```

## Step 2: Create Shipping Zone (if needed)

```graphql
mutation CreateShippingZone {
	shippingZoneCreate(
		input: { name: "Ghana Test Zone", countries: ["GH"], description: "Test shipping zone for Ghana" }
	) {
		shippingZone {
			id
			name
			countries {
				code
				country
			}
		}
		errors {
			field
			message
			code
		}
	}
}
```

## Step 3: Create Shipping Method

```graphql
mutation CreateShippingMethod($shippingZoneId: ID!) {
	shippingMethodCreate(
		input: {
			name: "Standard Delivery"
			shippingZone: $shippingZoneId
			type: PRICE
			minimumDeliveryDays: 2
			maximumDeliveryDays: 5
		}
	) {
		shippingMethod {
			id
			name
			type
			minimumDeliveryDays
			maximumDeliveryDays
		}
		errors {
			field
			message
			code
		}
	}
}
```

### Variables for Step 3:

```json
{
	"shippingZoneId": "U2hpcHBpbmdab25lOjE="
}
```

## Step 4: Add Shipping Method to Channel

```graphql
mutation AddShippingMethodToChannel($methodId: ID!, $channelId: ID!) {
	shippingMethodChannelListingUpdate(
		id: $methodId
		input: { addChannels: [{ channelId: $channelId, price: 15.00, minimumOrderPrice: 0 }] }
	) {
		shippingMethod {
			id
			name
			channelListings {
				channel {
					slug
				}
				price {
					amount
					currency
				}
			}
		}
		errors {
			field
			message
			code
		}
	}
}
```

### Variables for Step 4:

```json
{
	"methodId": "U2hpcHBpbmdNZXRob2Q6MQ==",
	"channelId": "Q2hhbm5lbDox"
}
```

## Instructions:

1. **Open Saleor GraphQL Playground**: Go to `http://localhost:8000/graphql/` (or your Saleor URL)

2. **Run Step 1**: Copy and run the first query to get your channel IDs

3. **Run Step 2**: Create the shipping zone and note the returned ID

4. **Run Step 3**: Create the shipping method using the zone ID from Step 2

5. **Run Step 4**: Add the shipping method to your channel using both IDs

6. **Test**: Go to your storefront checkout and verify the shipping option appears

## Alternative: Quick Setup via Saleor Dashboard

1. Go to **Saleor Dashboard** → **Shipping** → **Shipping Zones**
2. Click **Create Shipping Zone**
3. Name: "Ghana Test Zone", Countries: Ghana
4. Add **Shipping Method**: "Standard Delivery", Price: 15 GHS, 2-5 days
5. Assign to your GHS channel

This will be much faster than the GraphQL approach!
