namespace PropertyListing.Dtos
{
    public enum PropertyListingTypeList
    {
        Residential = 1,
        Rental = 2,
        Rural = 3,
        Sold = 4,
        Commercial = 5
    }

   public enum PropertyTypeList
   {
      All = 0,
      House = 1,
      Section = 2,
      Apartment = 3,
      Unit = 4,
      Townhouse = 5,
      Lifestyle = 6
   }

    public enum SearchByList
    {
        Open_homes = 0,
        Mortgagee_sales = 1,
        Available_now = 2,
        Pets_allowed = 3
    }

    public enum SortByList
    {
       Newest = 1,
       Oldest = 2,
       Highest_price = 3,
       Lowest_price = 4
    }

}
