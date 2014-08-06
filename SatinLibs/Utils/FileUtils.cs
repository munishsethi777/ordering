using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
namespace SatinLibs
{
   public class FileUtils
    {
       public static String[] getFilesFromFolder(String folderPath, String extension)
        {
            String[] filePaths = Directory.GetFiles(@folderPath, "*." + extension);
            return filePaths;
        }
    }
}
