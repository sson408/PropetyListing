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
    }
}
