using Microsoft.EntityFrameworkCore;
using ADHDWebApp.Models;

namespace ADHDWebApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserFile> UserFiles { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<SharedFile> SharedFiles { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserFile>()
                .HasOne(f => f.User)
                .WithMany(u => u.Files)
                .HasForeignKey(f => f.UserId);

            // FriendRequest configuration
            modelBuilder.Entity<FriendRequest>(entity =>
            {
                entity.HasOne(fr => fr.Requester)
                      .WithMany()
                      .HasForeignKey(fr => fr.RequesterId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(fr => fr.Addressee)
                      .WithMany()
                      .HasForeignKey(fr => fr.AddresseeId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Unique pair: prevent duplicates in one direction
                entity.HasIndex(fr => new { fr.RequesterId, fr.AddresseeId })
                      .IsUnique();
            });

            // SharedFile configuration
            modelBuilder.Entity<SharedFile>(entity =>
            {
                entity.HasOne(sf => sf.Sender)
                      .WithMany()
                      .HasForeignKey(sf => sf.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(sf => sf.Recipient)
                      .WithMany()
                      .HasForeignKey(sf => sf.RecipientId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(sf => sf.OriginalFile)
                      .WithMany()
                      .HasForeignKey(sf => sf.OriginalFileId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Message configuration
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasOne(m => m.Sender)
                      .WithMany()
                      .HasForeignKey(m => m.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(m => m.Recipient)
                      .WithMany()
                      .HasForeignKey(m => m.RecipientId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}