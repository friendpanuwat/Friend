import { Fragment } from "react";

/**
 * Thai has no spaces between words, so browsers may break a line inside a phrase
 * ("เท่า|ไหร่"). Mark allowed break points with "|" and each chunk stays whole.
 */
export const Phrase = ({ text }: { text: string }) => {
  const parts = text.split("|");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          <span className="inline-block">{p}</span>
          {i < parts.length - 1 && "​"}
        </Fragment>
      ))}
    </>
  );
};

export const plain = (text: string) => text.replace(/\|/g, "");
