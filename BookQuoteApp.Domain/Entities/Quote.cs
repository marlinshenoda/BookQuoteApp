namespace BookQuoteApp.Domain.Entities;

public class Quote
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}
