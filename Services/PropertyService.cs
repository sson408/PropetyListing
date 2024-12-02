using System.Text.Json;
using PropertyListing.Models;
using PropertyListing.Interfaces;
using PropertyListing.Dtos;
using static PropertyListing.Dtos.PropertyDTO;

namespace PropertyListing.Services
{
    public class PropertyService : IPropertyService
    {

        //private readonly string _defaultFilePath = "wwwroot/data/simple residential sample data.json";

        private readonly string _residentialFilePath;
        private readonly string _rentalFilePath;
        private readonly ILogger<PropertyService> _logger;


        public PropertyService(IConfiguration configuration, ILogger<PropertyService> logger) {
            _residentialFilePath = configuration["PropertyReadingPaths:Residential"];
            _rentalFilePath = configuration["PropertyReadingPaths:Rental"];
            _logger = logger;
        }

        public List<SimplePropertyDtoSummary> ListAll(PropertySearchOptionsSummary filterDetails)
        {
            var result = new List<SimplePropertyDtoSummary>();

            try {

                var propertyListingTypeName = filterDetails != null && !string.IsNullOrEmpty(filterDetails.PropertyListingTypeName) ? filterDetails.PropertyListingTypeName : "Residential";
                var propertyListingTypeId = (int)Enum.Parse(typeof(PropertyListingTypeList), propertyListingTypeName);

                var path = "";
                switch (propertyListingTypeId)
                {
                    case (int)PropertyListingTypeList.Rental:
                        path = _rentalFilePath;
                        break;
                    default:
                    case (int)PropertyListingTypeList.Residential:
                        path = _residentialFilePath;
                        break;
                }

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var jsonData = System.IO.File.ReadAllText(path);
                var response = JsonSerializer.Deserialize<ApiResponse<RealEstateProperty>>(jsonData, options);

                var properties = response?.DataList ?? new List<RealEstateProperty>();

                //add filters


                result = properties.Select(l => new SimplePropertyDtoSummary
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
            catch (Exception e)
            {
                // Log the exception
                _logger.LogError(e, "An error occurred while listing properties.");
            }

            return result;
        }
    }
}
