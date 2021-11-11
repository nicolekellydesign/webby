export interface ProgressInfo {
  percentage: number;
  fileName?: string;
}

class UploadService {
  upload(
    file: File,
    onUploadProgress: (percentage: number) => void,
    onFinish: (status: number, response: Response) => void
  ) {
    const formData = new FormData();
    formData.append("file", file, file.name);

    let request = new XMLHttpRequest();
    request.open("POST", "/api/v1/admin/upload");

    request.addEventListener("progress", (e) => {
      const percentage = (e.loaded / e.total) * 100;
      onUploadProgress(percentage);
    });

    request.addEventListener("load", () => {
      const { status, response } = request;
      onFinish(status, response);
    });

    request.send(formData);
  }
}

export default new UploadService();
