using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RecommenderDeployment.API.Models;

namespace RecommenderDeployment.API.Services
{
    public class AzureMLService
    {
        private readonly HttpClient _httpClient;
        private readonly string _endpoint;

        public AzureMLService(IOptions<AzureMLConfig> config)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", config.Value.ApiKey);
            _endpoint = config.Value.Endpoint;
        }

        public async Task<string> GetRecommendationAsync(PredictionRequest input)
        {
            var content = new StringContent(JsonConvert.SerializeObject(input), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_endpoint, content);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
    }
}

namespace RecommenderDeployment.API.Models
{
    public class PredictionRequest
    {
        public string UserId { get; set; }
        public List<string> ItemIds { get; set; }
    }
}