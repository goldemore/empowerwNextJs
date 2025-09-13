

"use client";

import DOMPurify from "dompurify";

interface Props {
  html: string;
  className?: string;
}

const SafeHtmlAboutUs = ({ html, className }: Props) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
};

export default SafeHtmlAboutUs;
