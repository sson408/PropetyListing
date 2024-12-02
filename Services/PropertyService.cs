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
                if (filterDetails != null)
                {
                    if (filterDetails.MinPrice > 0) {
                        properties.RemoveAll(l =>
                        {
                            
                            if (decimal.TryParse(l.Price.Replace("$", "").Replace(",", ""), out decimal priceValue))
                            {
                                return priceValue < filterDetails.MinPrice;
                            }
                            
                            return false;
                        });
                    }

                    if (filterDetails.MaxPrice > 0 && filterDetails.MaxPrice < 10000000)
                    {
                        properties.RemoveAll(l =>
                        {
                            if (decimal.TryParse(l.Price.Replace("$", "").Replace(",", ""), out decimal priceValue))
                            {
                                return priceValue > filterDetails.MaxPrice;
                            }

                            return false;
                        });
                    }

                    if (filterDetails.MinBedrooms > 0)
                    {
                        properties.RemoveAll(l => l.BedroomCount < filterDetails.MinBedrooms);
                    }

                    if (filterDetails.MaxBedrooms > 0)
                    {
                        properties.RemoveAll(l => l.BedroomCount > filterDetails.MaxBedrooms);
                    }

                    if (filterDetails.MinBathrooms > 0)
                    {
                        properties.RemoveAll(l => l.BathroomCount < filterDetails.MinBathrooms);
                    }

                    if (filterDetails.MaxBathrooms > 0)
                    {
                        properties.RemoveAll(l => l.BathroomCount > filterDetails.MaxBathrooms);
                    }

                    if (filterDetails.MinLandArea > 0)
                    {
                        properties.RemoveAll(l => l.LandArea < filterDetails.MinLandArea);                       
                    }

                    if (filterDetails.MaxLandArea > 0 && filterDetails.MaxLandArea < 100000)
                    {
                        properties.RemoveAll(l => l.LandArea > filterDetails.MaxLandArea);
                    }

                    if (!string.IsNullOrEmpty(filterDetails.Keywords))
                    {
                        var filterKeywords = filterDetails.Keywords.ToLower().Split(" ");
                        foreach (var word in filterKeywords) {
                            properties.RemoveAll(l => !l.AdHeadline.ToLower().Contains(word)
                              && !l.AdSummary.ToLower().Contains(word)
                              && !l.Street.ToLower().Contains(word));
                        }
          
                    }
                    //sort by
                    if (!string.IsNullOrEmpty(filterDetails.SortBy))
                    {
                        var sortOptions = new Dictionary<string, Func<IEnumerable<RealEstateProperty>>>
                        {
                            { "newest", () => properties.OrderByDescending(l => l.PendingLiveDate) },
                            { "oldest", () => properties.OrderBy(l => l.PendingLiveDate) },
                            { "highest price", () => properties.OrderByDescending(l =>
                                {
                                    if (decimal.TryParse(l.Price, out decimal priceValue))
                                    {
                                        return priceValue;
                                    }
                                    return 0; 
                                })
                            },
                            { "lowest price", () => properties.OrderBy(l =>
                                {
                                    if (decimal.TryParse(l.Price, out decimal priceValue))
                                    {
                                        return priceValue;
                                    }
                                    return 0;
                                })
                            }
                        };

                        var sortByDisplay = filterDetails.SortBy.Replace("_", " ").ToLower();

                        if (sortOptions.TryGetValue(sortByDisplay, out var sortFunc))
                        {
                            properties = sortFunc().ToList(); 
                        }
                    }

                    //search only
                    //if (!string.IsNullOrEmpty(filterDetails.SearchBy))
                    //{
                    //    var searchByDisplay = filterDetails.SearchBy.Replace("_", " ");
                    //    switch (searchByDisplay)
                    //    {
                    //        case "Open_homes":                             
                    //            break;
                    //        case "Mortgagee_sales":                              
                    //            break;
                    //        case "Available_now":                   
                    //            break;
                    //        case "Pets_allowed":                              
                    //            break;
                    //    }
                    //}
                }


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
