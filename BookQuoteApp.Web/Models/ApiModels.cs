namespace BookQuoteApp.Web.Models;

public record RegisterRequest(string UserName, string Email, string Password);

public record LoginRequest(string UserName, string Password);

public record AuthResponse(string Token, string UserName);

public record BookDto(int Id, string Title, string Author, DateOnly PublishedDate);

public record CreateBookRequest(string Title, string Author, DateOnly PublishedDate);

public record UpdateBookRequest(string Title, string Author, DateOnly PublishedDate);

public record QuoteDto(int Id, string Text, string Source);

public record CreateQuoteRequest(string Text, string Source);

public record UpdateQuoteRequest(string Text, string Source);
