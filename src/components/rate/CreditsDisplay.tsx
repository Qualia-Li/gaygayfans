"use client";

import { useAuthStore } from "@/store/authStore";
import { Card, Flex, Text, Badge } from "@radix-ui/themes";

export default function CreditsDisplay() {
  const { isLoggedIn, credits, ratingsCount } = useAuthStore();

  if (!isLoggedIn) return null;

  return (
    <Card className="!bg-zinc-800/80 backdrop-blur" size="2">
      <Flex align="center" gap="4" wrap="wrap">
        <Flex align="center" gap="2">
          <Text size="2" color="gray">Credits:</Text>
          <Badge size="2" color="pink" variant="solid" highContrast>
            {credits}
          </Badge>
        </Flex>
        <Flex align="center" gap="2">
          <Text size="2" color="gray">Ratings:</Text>
          <Badge size="2" color="purple" variant="solid" highContrast>
            {ratingsCount}
          </Badge>
        </Flex>
        <Text size="1" color="gray" className="italic">
          Every rating gives you +1 credit!
        </Text>
      </Flex>
    </Card>
  );
}
