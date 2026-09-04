using BookQuoteApp.Domain.Entities;
using BookQuoteApp.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookQuoteApp.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Book> Books => Set<Book>();
    public DbSet<Quote> Quotes => Set<Quote>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Quote>()
            .HasIndex(q => q.UserId);

        builder.Entity<Book>().HasData(
            new Book { Id = 1, Title = "1984", Author = "George Orwell", PublishedDate = new DateOnly(1949, 6, 8) },
            new Book { Id = 2, Title = "Harry Potter och De vises sten", Author = "J.K. Rowling", PublishedDate = new DateOnly(1997, 6, 26) },
            new Book { Id = 3, Title = "Ringarnas herre", Author = "J.R.R. Tolkien", PublishedDate = new DateOnly(1954, 7, 29) });
    }
}
