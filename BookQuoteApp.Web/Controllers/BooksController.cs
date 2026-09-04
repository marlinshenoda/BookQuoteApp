using BookQuoteApp.Domain.Entities;
using BookQuoteApp.Infrastructure.Data;
using BookQuoteApp.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookQuoteApp.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetAll()
    {
        var books = await _context.Books
            .OrderBy(b => b.Title)
            .Select(b => new BookDto(b.Id, b.Title, b.Author, b.PublishedDate))
            .ToListAsync();

        return Ok(books);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookDto>> GetById(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        return Ok(new BookDto(book.Id, book.Title, book.Author, book.PublishedDate));
    }

    [HttpPost]
    public async Task<ActionResult<BookDto>> Create(CreateBookRequest request)
    {
        var book = new Book
        {
            Title = request.Title,
            Author = request.Author,
            PublishedDate = request.PublishedDate
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        var dto = new BookDto(book.Id, book.Title, book.Author, book.PublishedDate);
        return CreatedAtAction(nameof(GetById), new { id = book.Id }, dto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateBookRequest request)
    {
        var book = await _context.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        book.Title = request.Title;
        book.Author = request.Author;
        book.PublishedDate = request.PublishedDate;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
