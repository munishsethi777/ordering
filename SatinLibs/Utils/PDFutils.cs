using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using org.apache;
using org.apache.pdfbox.pdmodel;
using org.apache.pdfbox.util;
namespace SatinLibs
{
    class PDFutils
    {
        private static string getTextFromPDF(String fileLocation)
        {
            PDDocument doc = PDDocument.load(fileLocation);
            PDFTextStripper stripper = new PDFTextStripper();
            String txt = stripper.getText(doc);
            return txt;
        }
    }
}
