using System.Collections;
using System.Security.Cryptography;
using System.Text;

namespace AirHealthV5.Server.Helpers;

public class PasswordHelper
{
    public static string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    public static bool VerifyPassword(string password, string hash)
    {
        var hashBytes = Convert.FromBase64String(hash);
        using (var sha256 = SHA256.Create())
        {
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            var computedHashBytes = sha256.ComputeHash(passwordBytes);
            return StructuralComparisons.StructuralEqualityComparer.Equals(hashBytes, computedHashBytes);
        }
    }
}