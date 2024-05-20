using Azure.Storage.Blobs.Models;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IAzureBlobStorageService
    {
        public Task<Uri> UploadBlobAsync(Stream content, string blobName);
        public Task<BlobDownloadInfo> DownloadBlobAsync(string blobName);
        public Task<bool> DeleteBlobAsync(string blobName);
    }
}
