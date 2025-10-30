import { toast } from "sonner";
import DeleteButton from "./DeleteButtons";

const FileUpload = ({ config, onFileSelect, onFileDelete }) => {
  const Icon = config.icon;
  const Preview = config.preview;

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-secondary-foureground">
        {config.label}
      </label>
      <div
        className={`mt-2 relative border-2 border-dashed rounded-lg p-4 transition-colors bg-card border-border hover:border-primary `}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer?.files;
          if (!files?.length) return;
          const droppedFile = files[0];
          if (config.allowedTypes.includes(droppedFile.type)) {
            onFileSelect(droppedFile);
          } else {
            console.error("Invalid file type");
          }
        }}
      >
        <input
          id={config.id}
          type="file"
          accept={config.accept}
          onChange={(e) => {
            const files = e.target.files;
            if (!files?.length) return;
            const selectedFile = files[0];
            if (config.allowedTypes.includes(selectedFile.type)) {
              onFileSelect(files);
            } else {
              toast.error('file type is invalid')
            }
          }}
          className="hidden"
        />
        {!config.file ? (
          <label
            htmlFor={config.id}
            className="flex flex-col items-center gap-2 cursor-pointer p-4"
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--color-popover)]">
              <Icon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-primary">
                Click to upload
              </span>
              <span className="text-sm text-[var(--color-muted-foreground)]">
                {" "}
                or drag and drop
              </span>
            </div>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              {config.dropzoneText}
            </span>
          </label>
        ) : (
          <div className="relative group">
            <Preview />
            <DeleteButton
              onDelete={(e) => {
                e.stopPropagation();
                onFileDelete();
                const fileInput = document.getElementById(config.id);
                if (fileInput) fileInput.value = "";
              }}
              className="absolute -top-2 -right-2 z-10 w-6 h-6"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
