import { useCallback } from "react";

interface UseCopyToClipboardReturn {
  copyToClipboard: (text: string, buttonId: string) => Promise<void>;
}

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const copyToClipboard = useCallback(
    async (text: string, buttonId: string) => {
      try {
        await navigator.clipboard.writeText(text);
        const button = document.getElementById(buttonId);

        if (button) {
          const originalHTML = button.innerHTML;
          const originalClasses = button.className;

          // Show success state
          button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
          button.classList.add("text-green-400");
          button.classList.remove("text-cyan-400");

          // Reset after 2 seconds
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.className = originalClasses;
          }, 2000);
        }
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        // Optionally show error toast/notification
      }
    },
    []
  );

  return { copyToClipboard };
};
