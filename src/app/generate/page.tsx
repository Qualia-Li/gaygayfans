import Link from "next/link";
import { Container, Heading, Text } from "@radix-ui/themes";
import GenerateForm from "@/components/generate/GenerateForm";

export const metadata = {
  title: "Generate Video — GaylyFans",
  description: "Generate AI videos from X/Twitter post images",
};

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Container size="3" className="px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white text-sm mb-2 inline-block"
          >
            &larr; Back to feed
          </Link>
          <Heading size="6">Generate Video</Heading>
          <Text size="2" color="gray" className="mt-1 block">
            Paste an X/Twitter post URL, select an image, and generate an AI video
          </Text>
        </div>
        <GenerateForm />
      </Container>
    </div>
  );
}
