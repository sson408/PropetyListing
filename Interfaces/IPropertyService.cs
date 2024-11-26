using PropertyListing.Models;
using static PropertyListing.Dtos.PropertyDTO;

namespace PropertyListing.Interfaces
{
    public interface IPropertyService
    {
        List<SimplePropertyDtoSummary> ListAll();
    }
}
