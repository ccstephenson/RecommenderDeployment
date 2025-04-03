using CsvHelper;
using System.Globalization;
using RecommenderDeployment.API.Models;

namespace RecommenderDeployment.API.Services
{
    public class CsvDataService
    {
        public List<CollaborativeRecommendation> LoadRecommendations(string filePath)
        {
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            return csv.GetRecords<CollaborativeRecommendation>().ToList();
        }
    }
}