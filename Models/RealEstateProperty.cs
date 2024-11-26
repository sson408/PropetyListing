using System.Text.Json.Serialization;

namespace PropertyListing.Models
{

    public class RealEstateProperty
    {
        [JsonPropertyName("listingNumber")]
        public int ListingNumber { get; set; }

        [JsonPropertyName("lineOfBusiness")]
        public string LineOfBusiness { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("propertyType")]
        public string PropertyType { get; set; }

        [JsonPropertyName("geoLat")]
        public double GeoLat { get; set; }

        [JsonPropertyName("geoLong")]
        public double GeoLong { get; set; }

        [JsonPropertyName("geoCodeWgs")]
        public string GeoCodeWgs { get; set; }

        [JsonPropertyName("street")]
        public string Street { get; set; }

        [JsonPropertyName("streetNumber")]
        public string StreetNumber { get; set; }

        [JsonPropertyName("streetOnly")]
        public string StreetOnly { get; set; }

        [JsonPropertyName("suburb")]
        public string Suburb { get; set; }

        [JsonPropertyName("region")]
        public string Region { get; set; }

        [JsonPropertyName("images")]
        public List<string> Images { get; set; }

        [JsonPropertyName("imageCount")]
        public int ImageCount { get; set; }

        [JsonPropertyName("video")]
        public string Video { get; set; }

        [JsonPropertyName("price")]
        public string Price { get; set; }

        [JsonPropertyName("settlementDate")]
        public DateTime SettlementDate { get; set; }

        [JsonPropertyName("bedroomCount")]
        public int BedroomCount { get; set; }

        [JsonPropertyName("bathroomCount")]
        public int BathroomCount { get; set; }

        [JsonPropertyName("parkingCount")]
        public int ParkingCount { get; set; }

        [JsonPropertyName("adHeadline")]
        public string AdHeadline { get; set; }

        [JsonPropertyName("adSummary")]
        public string AdSummary { get; set; }

        [JsonPropertyName("nextOpenHome")]
        public DateTime NextOpenHome { get; set; }

        [JsonPropertyName("overlay")]
        public string Overlay { get; set; }

        [JsonPropertyName("isGSTInclusive")]
        public bool IsGSTInclusive { get; set; }

        [JsonPropertyName("landUse")]
        public List<string> LandUse { get; set; }

        [JsonPropertyName("floorArea")]
        public int FloorArea { get; set; }

        [JsonPropertyName("landArea")]
        public int LandArea { get; set; }

        [JsonPropertyName("pendingLiveDate")]
        public DateTime PendingLiveDate { get; set; }

        [JsonPropertyName("tenderDateTime")]
        public DateTime TenderDateTime { get; set; }

        [JsonPropertyName("auctionLocation")]
        public string AuctionLocation { get; set; }

        [JsonPropertyName("auctionRoomNumber")]
        public int AuctionRoomNumber { get; set; }

        [JsonPropertyName("auctionLotNumber")]
        public int AuctionLotNumber { get; set; }

        [JsonPropertyName("majorChangeDate")]
        public DateTime MajorChangeDate { get; set; }
    }
}
