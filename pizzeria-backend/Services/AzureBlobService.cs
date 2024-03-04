using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace pizzeria_backend.Services
{
    public interface IAzureBlobStorageService
    {
        public Task<Uri> UploadBlobAsync(Stream content, string blobName);
        public Task<BlobDownloadInfo> DownloadBlobAsync(string blobName);
        public Task<bool> DeleteBlobAsync(string blobName);
    }

    public class AzureBlobStorageService : IAzureBlobStorageService
    {
        private static BlobServiceClient _blobServiceClient;
        private static BlobContainerClient _blobContainerClient;
        private readonly IConfiguration _configuration;

        public AzureBlobStorageService(IConfiguration configuration)
        {
            _configuration = configuration;
            var connectionString = _configuration.GetConnectionString("AzureBlobStorage");
            _blobServiceClient = new BlobServiceClient(connectionString);
            _blobContainerClient = _blobServiceClient.GetBlobContainerClient("images");
        }

        public async Task<Uri> UploadBlobAsync(Stream content, string blobName)
        {
            var blobClient = _blobContainerClient.GetBlobClient(blobName + Guid.NewGuid().ToString());
            await blobClient.UploadAsync(content);
            return new Uri(blobClient.Uri.AbsoluteUri);
        }

        public async Task<BlobDownloadInfo> DownloadBlobAsync(string blobName)
        {
            var blobClient = _blobContainerClient.GetBlobClient(blobName);
            return await blobClient.DownloadAsync();
        }

        public async Task<bool> DeleteBlobAsync(string blobName)
        {
            var blobCLient = _blobContainerClient.GetBlobClient(blobName);
            await blobCLient.DeleteIfExistsAsync();


            return true;

        }
    }
}