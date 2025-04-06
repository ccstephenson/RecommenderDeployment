using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using RecommenderDeployment.API.Models;
using RecommenderDeployment.API.Services;
using System.IO;
using System.Linq;

namespace RecommenderDeployment.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PredictionController : ControllerBase
    {
        private readonly AzureMLService _mlService;
        private readonly CsvDataService _csvService;

        public PredictionController(AzureMLService mlService, CsvDataService csvService)
        {
            _mlService = mlService;
            _csvService = csvService;
        }

        // [HttpPost]
        // public async Task<IActionResult> GetPrediction([FromBody] PredictionRequest input)
        // {
        //     if (input == null)
        //     {
        //         return BadRequest("Input cannot be null.");
        //     }
        //
        //     try
        //     {
        //         // var config = await _jsonService.LoadJsonAsync<Content>("path/to/config.json");
        //         // var reference = await _jsonService.LoadJsonAsync<Collaborative>("path/to/reference.json");
        //         
        //         var path = Path.Combine(Directory.GetCurrentDirectory(), "collaborative_recommendations.csv");
        //         var recommendations = _csvService.LoadRecommendations(path);
        //         
        //         var result = await _mlService.GetRecommendationAsync(input);
        //         return Ok(result);
        //     }
        //     catch (Exception ex)
        //     {
        //         // You can enhance this with logging if needed
        //         return StatusCode(500, $"An error occurred: {ex.Message}");
        //     }

        [HttpGet("csv-preview")]
        public IActionResult GetCsvPreview()
        {
            try
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "Data", "collaborative_recommendations.csv");

                if (!System.IO.File.Exists(path))
                {
                    return NotFound("CSV file not found.");
                }

                var recommendations = _csvService.LoadRecommendations(path);

                return Ok(new
                {
                    message = "CSV loaded successfully",
                    count = recommendations.Count,
                    sample = recommendations.Take(5)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while loading the CSV file: {ex.Message}");
            }
        }

        [HttpGet("recommendations/{itemId}")]
        public IActionResult GetRecommendationsForItem(double itemId)
        {
            try
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "Data", "collaborative_recommendations.csv");

                if (!System.IO.File.Exists(path))
                {
                    return NotFound("CSV file not found.");
                }

                var recommendations = _csvService.LoadRecommendations(path);
                Console.WriteLine("Looking for ID: " + itemId); // 🔍 Debug

                var match = recommendations.FirstOrDefault(r => r.Id == itemId);

                if (match == null)
                {
                    return NotFound($"No recommendation found for ID: {itemId}");
                }

                return Ok(new
                {
                    id = match.Id,
                    title = match.Title,
                    recommendation1 = match.Recommendation1,
                    recommendation2 = match.Recommendation2,
                    recommendation3 = match.Recommendation3,
                    recommendation4 = match.Recommendation4,
                    recommendation5 = match.Recommendation5
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving the recommendation: {ex.Message}");
            }
        }
    }
}
