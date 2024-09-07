import { Container, VStack, Heading, Text, HStack, Tag, Button } from '@chakra-ui/react';

const ListingDetails = ({ listing, onBack }) => {
  const listingData = listing || {};

  return (
    <Container py={8} px={4} maxW="container.md">
      <Button onClick={onBack} colorScheme="blue" mb={4}>
        Back to Listings
      </Button>
      <VStack align="stretch" spacing={4}>
        <Heading fontSize={{ base: "2xl", md: "3xl" }} textAlign="left">
          {`${listingData.addressLine1}, ${listingData.city}, ${listingData.state}`}
        </Heading>
        <Text fontSize="lg" fontWeight="bold">
          ${listingData.price}/mo | {listingData.bedrooms} bed | {listingData.bathrooms} bath
        </Text>
        <Text fontSize="md">
          {listingData.squareFootage} sqft
        </Text>
        <Text fontSize="md">
          Listed: {new Date(listingData.listedDate).toLocaleDateString()}
        </Text>
        <Text fontSize="md">
          {listingData.daysOld} days on market
        </Text>
        <Text fontSize="md">
          Property Type: {listingData.propertyType}
        </Text>
        <Text fontSize="md">
          Description: {listingData.description}
        </Text>
        <HStack spacing={2}>
          <Tag size="md" variant="outline" colorScheme="green">
            {listingData.propertyType}
          </Tag>
        </HStack>
        <Text fontSize="md">
          Full Address: {listingData.formattedAddress}
        </Text>
        <Text fontSize="md">
          Zip Code: {listingData.zipCode}
        </Text>
        <Text fontSize="md">
          County: {listingData.county}
        </Text>
        {/* <Text fontSize="md">
          Latitude: {listingData.latitude}
        </Text>
        <Text fontSize="md">
          Longitude: {listingData.longitude}
        </Text> */}
        {listingData.yearBuilt && (
          <Text fontSize="md">
            Year Built: {listingData.yearBuilt}
          </Text>
        )}
        <Text fontSize="md">
          Last Seen Date: {new Date(listingData.lastSeenDate).toLocaleDateString()}
        </Text>
        <Text fontSize="md">
          Distance: {listingData.distance} miles
        </Text>
        <Text fontSize="md">
          Correlation: {listingData.correlation}
        </Text>
      </VStack>
    </Container>
  );
};

export default ListingDetails;