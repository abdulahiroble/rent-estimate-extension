import { Container, Flex, VStack, Heading, HStack, Tag, Button, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Carousel from './Carousel';
import capsFirst from '../utilities/capsFirst';

const Listings = ({listings}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(listings?.listings || []);
    }, [listings])

    return (
        <div>
            <Container
                py={8}
                px={0}
                maxW="container.md"
            >
                <Carousel gap={32}>
                    {data.map((listing, index) => (
                        <Flex
                            key={index}
                            boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                            justifyContent="space-between"
                            flexDirection="column"
                            overflow="hidden"
                            color="gray.300"
                            bg="base.d100"
                            rounded={5}
                            flex={1}
                            p={5}
                            width="300px"
                            flexShrink={0}
                        >
                            <VStack align="stretch" spacing={2} mb={6}>
                                <Heading
                                    fontSize={{ base: "lg", md: "xl" }}
                                    textAlign="left"
                                    w="full"
                                    noOfLines={1}
                                >
                                    {`${listing.addressLine1}, ${listing.city}, ${listing.state}`}
                                </Heading>
                                <Text fontSize="md" fontWeight="bold">
                                    ${listing.price}/mo | {listing.bedrooms} bed | {listing.bathrooms} bath
                                </Text>
                                <Text fontSize="sm">
                                    {listing.squareFootage} sqft
                                </Text>
                                <Text fontSize="sm">
                                    Listed: {new Date(listing.listedDate).toLocaleDateString()}
                                </Text>
                                <Text fontSize="sm">
                                    {listing.daysOld} days on market
                                </Text>
                            </VStack>

                            <Flex justifyContent="space-between" alignItems="center">
                                <HStack spacing={2}>
                                    <Tag size="sm" variant="outline" colorScheme="green">
                                        {listing.propertyType}
                                    </Tag>
                                </HStack>
                                <Button
                                    onClick={() => alert(`Listing ${listing.id} clicked`)}
                                    colorScheme="green"
                                    fontWeight="bold"
                                    color="gray.900"
                                    size="sm"
                                >
                                    More
                                </Button>
                            </Flex>
                        </Flex>
                    ))}
                </Carousel>
            </Container>
        </div>
    )
}

export default Listings