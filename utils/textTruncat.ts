export const textTruncat = (
    text: string,
    maxWords: number = 2,
    truncateIndicator: string = "..."
  ): string => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return `${words.slice(0, maxWords).join(" ")}${truncateIndicator}`;
    }
    return text;
  };