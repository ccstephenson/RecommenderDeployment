using CsvHelper.Configuration;
using RecommenderDeployment.API.Models;
using System.Globalization;

public class CollaborativeRecommendationMap : ClassMap<CollaborativeRecommendation>
{
    public CollaborativeRecommendationMap()
    {
        Map(m => m.Id).Name("Id").TypeConverterOption.NumberStyles(NumberStyles.Integer);
        Map(m => m.Title).Name("Title");
        Map(m => m.Recommendation1).Name("Recommendation1");
        Map(m => m.Recommendation2).Name("Recommendation2");
        Map(m => m.Recommendation3).Name("Recommendation3");
        Map(m => m.Recommendation4).Name("Recommendation4");
        Map(m => m.Recommendation5).Name("Recommendation5");
    }
}