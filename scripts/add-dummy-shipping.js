#!/usr/bin/env node

/**
 * Script to add a dummy shipping method for testing
 * This script creates a basic shipping method that can be used during checkout testing
 */

const SALEOR_API_URL = process.env.SALEOR_API_URL || "http://localhost:8000/graphql/";
const SALEOR_AUTH_TOKEN = process.env.SALEOR_AUTH_TOKEN || "";

// GraphQL mutation to create shipping zone
const CREATE_SHIPPING_ZONE_MUTATION = `
  mutation CreateShippingZone($input: ShippingZoneCreateInput!) {
    shippingZoneCreate(input: $input) {
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
`;

// GraphQL mutation to create shipping method
const CREATE_SHIPPING_METHOD_MUTATION = `
  mutation CreateShippingMethod($input: ShippingMethodInput!) {
    shippingMethodCreate(input: $input) {
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
`;

// GraphQL mutation to add shipping method to channel
const ADD_SHIPPING_METHOD_TO_CHANNEL_MUTATION = `
  mutation AddShippingMethodToChannel($id: ID!, $input: ShippingMethodChannelListingInput!) {
    shippingMethodChannelListingUpdate(id: $id, input: $input) {
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
`;

// GraphQL query to get channels
const GET_CHANNELS_QUERY = `
  query GetChannels {
    channels {
      id
      name
      slug
      currencyCode
    }
  }
`;

async function makeGraphQLRequest(query, variables = {}) {
	const response = await fetch(SALEOR_API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: SALEOR_AUTH_TOKEN ? `Bearer ${SALEOR_AUTH_TOKEN}` : "",
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	const result = await response.json();

	if (result.errors) {
		console.error("GraphQL errors:", result.errors);
		throw new Error("GraphQL request failed");
	}

	return result.data;
}

async function createDummyShipping() {
	try {
		console.log("🚀 Creating dummy shipping method for testing...");

		// First, get available channels
		console.log("📋 Fetching available channels...");
		const channelsData = await makeGraphQLRequest(GET_CHANNELS_QUERY);
		const channels = channelsData.channels;

		console.log(
			"📋 Available channels:",
			channels.map((c) => `${c.name} (${c.slug}) - ${c.currencyCode}`),
		);

		// Find GHS channel (or use default)
		const ghsChannel = channels.find((c) => c.currencyCode === "GHS") || channels[0];

		if (!ghsChannel) {
			throw new Error("No channels found. Please create a channel first.");
		}

		console.log(`✅ Using channel: ${ghsChannel.name} (${ghsChannel.slug}) - ${ghsChannel.currencyCode}`);

		// Create or use existing shipping zone
		console.log("🌍 Creating shipping zone...");
		const shippingZoneData = await makeGraphQLRequest(CREATE_SHIPPING_ZONE_MUTATION, {
			input: {
				name: "Ghana Shipping Zone",
				countries: ["GH"], // Ghana
				description: "Dummy shipping zone for Ghana testing",
			},
		});

		if (shippingZoneData.shippingZoneCreate.errors.length > 0) {
			console.log("⚠️ Shipping zone might already exist:", shippingZoneData.shippingZoneCreate.errors);
		}

		const shippingZone = shippingZoneData.shippingZoneCreate.shippingZone;
		console.log("✅ Shipping zone created:", shippingZone?.name || "Using existing");

		// Create shipping method
		console.log("📦 Creating shipping method...");
		const shippingMethodData = await makeGraphQLRequest(CREATE_SHIPPING_METHOD_MUTATION, {
			input: {
				name: "Standard Delivery",
				shippingZone: shippingZone?.id,
				type: "PRICE", // Price-based shipping
				minimumDeliveryDays: 2,
				maximumDeliveryDays: 5,
				description: "Standard delivery for testing",
			},
		});

		if (shippingMethodData.shippingMethodCreate.errors.length > 0) {
			console.error("❌ Failed to create shipping method:", shippingMethodData.shippingMethodCreate.errors);
			return;
		}

		const shippingMethod = shippingMethodData.shippingMethodCreate.shippingMethod;
		console.log("✅ Shipping method created:", shippingMethod.name);

		// Add shipping method to channel
		console.log("🔗 Adding shipping method to channel...");
		const channelListingData = await makeGraphQLRequest(ADD_SHIPPING_METHOD_TO_CHANNEL_MUTATION, {
			id: shippingMethod.id,
			input: {
				addChannels: [
					{
						channelId: ghsChannel.id,
						price: ghsChannel.currencyCode === "GHS" ? 15.0 : 1.0, // 15 GHS or 1 USD
						minimumOrderPrice: 0,
						maximumOrderPrice: null,
					},
				],
			},
		});

		if (channelListingData.shippingMethodChannelListingUpdate.errors.length > 0) {
			console.error(
				"❌ Failed to add shipping method to channel:",
				channelListingData.shippingMethodChannelListingUpdate.errors,
			);
			return;
		}

		console.log("🎉 Success! Dummy shipping method created:");
		console.log(`   Name: ${shippingMethod.name}`);
		console.log(
			`   Delivery: ${shippingMethod.minimumDeliveryDays}-${shippingMethod.maximumDeliveryDays} days`,
		);
		console.log(`   Price: ${ghsChannel.currencyCode === "GHS" ? "15.00 GHS" : "1.00 USD"}`);
		console.log(`   Channel: ${ghsChannel.name} (${ghsChannel.slug})`);
	} catch (error) {
		console.error("❌ Error creating dummy shipping method:", error.message);
	}
}

// Run the script
if (require.main === module) {
	createDummyShipping();
}

module.exports = { createDummyShipping };
