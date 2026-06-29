import { SocialGallery } from "@/components/home/SocialGallery";
import {
  getIdeaPromptContent,
  type IdeaPromptContext
} from "@/features/shared/contextual-sections/ideaPromptContent";

export function IdeaPromptSection({
  context
}: {
  context: IdeaPromptContext;
}) {
  const content = getIdeaPromptContent(context);

  return (
    <SocialGallery
      id={content.id}
      title={content.title}
      subtitle={content.subtitle}
      posts={content.posts}
      ariaLabel={content.ariaLabel}
      sourceHref={content.sourceHref}
    />
  );
}
