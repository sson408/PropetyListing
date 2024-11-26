using System.Text.Json;
using PropertyListing.Models;
using PropertyListing.Interfaces;
using PropertyListing.Dtos;
using static PropertyListing.Dtos.PropertyDTO;

namespace PropertyListing.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly List<RealEstateProperty> _properties;

        public PropertyService()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var jsonData = System.IO.File.ReadAllText("wwwroot/data/simple residential sample data.json");
            if (jsonData != null) {
                // Deserialize JSON to ApiResponse<RealEstateProperty>
                var response = JsonSerializer.Deserialize<ApiResponse<RealEstateProperty>>(jsonData, options);
                // Set _properties from response
                _properties = response?.DataList ?? new List<RealEstateProperty>();

            }       
        }

        public List<SimplePropertyDtoSummary> ListAll()
        {
            return _properties
           .Select(l => new SimplePropertyDtoSummary
           {
              PriceDisplay = l.Price.ToString(),
              ListingNumber = l.ListingNumber.ToString(),
              StreetDisplay = l.Street,
              IsNew = l.PendingLiveDate > DateTime.Now.AddDays(-7),
              NumberOfBedrooms = l.BedroomCount,
              NumberOfBathrooms = l.BathroomCount,
              ImageUrls = l.Images            
           }).ToList();
        }
    }
}
