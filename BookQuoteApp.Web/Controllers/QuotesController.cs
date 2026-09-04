using BookQuoteApp.Domain.Entities;
using BookQuoteApp.Infrastructure.Data;
using BookQuoteApp.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookQuoteApp.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuotesController : ControllerBase
{
    private const int MaxQuotesPerUser = 5;
    private readonly ApplicationDbContext _context;

    public QuotesController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string? UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue(ClaimTypes.Name)
        ?? User.FindFirstValue("sub");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuoteDto>>> GetMine()
    {
        if (UserId is null)
        {
            return Unauthorized();
        }

        var quotes = await _context.Quotes
            .Where(q => q.UserId == UserId)
            .OrderBy(q => q.Id)
            .Select(q => new QuoteDto(q.Id, q.Text, q.Source))
            .ToListAsync();

        return Ok(quotes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<QuoteDto>> GetById(int id)
    {
        if (UserId is null)
        {
            return Unauthorized();
        }

        var quote = await _context.Quotes.FirstOrDefaultAsync(q => q.Id == id && q.UserId == UserId);
        if (quote is null)
        {
            return NotFound();
        }

        return Ok(new QuoteDto(quote.Id, quote.Text, quote.Source));
    }

    [HttpPost]
    public async Task<ActionResult<QuoteDto>> Create(CreateQuoteRequest request)
    {
        if (UserId is null)
        {
            return Unauthorized();
        }

        var count = await _context.Quotes.CountAsync(q => q.UserId == UserId);
        if (count >= MaxQuotesPerUser)
        {
            return BadRequest($"Du kan högst spara {MaxQuotesPerUser} citat.");
        }

        var quote = new Quote
        {
            Text = request.Text,
            Source = request.Source,
            UserId = UserId
        };

        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = quote.Id }, new QuoteDto(quote.Id, quote.Text, quote.Source));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateQuoteRequest request)
    {
        if (UserId is null)
        {
            return Unauthorized();
        }

        var quote = await _context.Quotes.FirstOrDefaultAsync(q => q.Id == id && q.UserId == UserId);
        if (quote is null)
        {
            return NotFound();
        }

        quote.Text = request.Text;
        quote.Source = request.Source;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (UserId is null)
        {
            return Unauthorized();
        }

        var quote = await _context.Quotes.FirstOrDefaultAsync(q => q.Id == id && q.UserId == UserId);
        if (quote is null)
        {
            return NotFound();
        }

        _context.Quotes.Remove(quote);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
