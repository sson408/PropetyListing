namespace PropertyListing.Dtos
{
    public class PropertyDTO
    {
        public class SimplePropertyDtoSummary { 
            public string? ListingNumber { get; set; }
            public string? StreetDisplay { get; set; }
            public bool IsNew { get; set; }
            public string? PriceDisplay { get; set; }    
            public int? NumberOfBedrooms { get; set; }
            public int? NumberOfBathrooms { get; set; }
            public List<string>? ImageUrls { get; set; }
            public string? OpenHomeDateTimeDisplay { get; set; }        
        }

        public class PropertySearchOptionsSummary { 
            public string PropertyListingTypeName { get; set; }
            public List<string> LocationList { get; set; }
            public string Locations { get; set; }
            public double MinPrice { get; set; }
            public double MaxPrice { get; set; }
            public string PropertyTypeNames { get; set; }
            public int MinBedrooms { get; set; }
            public int MaxBedrooms { get; set; }
            public int MinBathrooms { get; set; }
            public int MaxBathrooms { get; set; }
            public string SortBy { get; set; }
            public string SearchBy { get; set; }
            public string Keywords { get; set; }
            public int MinLandArea { get; set; }
            public int MaxLandArea { get; set; }

        }
    }
}
