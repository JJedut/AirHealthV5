using System.Security.Cryptography;
using System.Text;

namespace AirHealthV5.Server.Helpers;

public class EncryptionHelper
{
    private readonly string? _encryptionKey;

    public EncryptionHelper(IConfiguration configuration)
    {
        _encryptionKey = configuration["EncryptionKey"];
    }

    public string Encrypt(string apiKey)
    {
        byte[] textBytes = Encoding.Unicode.GetBytes(apiKey);
        using (Aes encryptor = Aes.Create())
        {
            byte[] keyBytes = Encoding.Unicode.GetBytes(_encryptionKey!);
            encryptor.Key = SHA256.Create().ComputeHash(keyBytes);
            encryptor.IV = new byte[16];

            using (MemoryStream ms = new MemoryStream())
            {
                using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(textBytes, 0, textBytes.Length);
                    cs.Close();
                }
                apiKey = Convert.ToBase64String(ms.ToArray());
            }
        }
        return apiKey;
    }

    public string Decrypt(string apiKey)
    {
        byte[] textBytes = Convert.FromBase64String(apiKey);
        using (Aes encryptor = Aes.Create())
        {
            byte[] keyBytes = Encoding.Unicode.GetBytes(_encryptionKey!);
            encryptor.Key = SHA256.Create().ComputeHash(keyBytes);
            encryptor.IV = new byte[16];

            using (MemoryStream ms = new MemoryStream())
            {
                using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(textBytes, 0, textBytes.Length);
                    cs.Close();
                }
                apiKey = Encoding.Unicode.GetString(ms.ToArray());
            }
        }
        return apiKey;
    }
}