using Microsoft.AspNetCore.Mvc;

namespace pizzeria_backend.Controllers
{
    [Route("api/orders/v1.0")]
    [ApiController]
    public class OrderController : Controller
    {


        [HttpPost()]
        public IActionResult PostOrder()
        {
            return null;
        }


        [HttpGet("{id}")]
        public IActionResult GetOrder()
        {
            return null;
        }

        [HttpGet("complete/{id}")]
        public IActionResult CompleteOrder()
        {
            return null;
        }
    }
}
