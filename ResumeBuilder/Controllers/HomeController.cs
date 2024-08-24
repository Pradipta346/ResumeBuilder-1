using System;
using System.IO;
using System.Web.Mvc;
using Aspose.Pdf;
using Aspose.Pdf.Forms;

namespace ResumeBuilder.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Form()
        {
            return View();
        }

        public ActionResult Resumetemplates()
        {
            return View();
        }


        public ActionResult Temp1()
        {
            return View("~/Views/Home/Templates/Temp1.cshtml");
        }

        public ActionResult Temp2()
        {
            return View("~/Views/Home/Templates/Temp2.cshtml");
        }

        public ActionResult Temp3()
        {
            return View("~/Views/Home/Templates/Temp3.cshtml");
        }

        public ActionResult Temp4()
        {
            return View("~/Views/Home/Templates/Temp4.cshtml");
        }

        public ActionResult Temp5()
        {
            return View("~/Views/Home/Templates/Temp5.cshtml");
        }

        public ActionResult Temp6()
        {
            return View("~/Views/Home/Templates/Temp6.cshtml");
        }

        public ActionResult Temp7()
        {
            return View("~/Views/Home/Templates/Temp7.cshtml");
        }

        public ActionResult Temp8()
        {
            return View("~/Views/Home/Templates/Temp8.cshtml");
        }

        public ActionResult DownloadPdf()
        {
            string absoluteHtmlPath = @"C:/Users/pradiptan/Downloads/ResumeDownload.html";
            string tempPdfFile = Server.MapPath("~/App_Data/TempPdfFile.pdf");
            string htmlContent = System.IO.File.ReadAllText(absoluteHtmlPath);

            try
            {
                System.IO.File.WriteAllText(absoluteHtmlPath, htmlContent);

                HtmlLoadOptions htmlLoadOptions = new HtmlLoadOptions();
                htmlLoadOptions.IsRenderToSinglePage = true;
                htmlLoadOptions.PageInfo.Margin.Left = 10;
                htmlLoadOptions.PageInfo.Margin.Right = 10;
                using (Document pdfDocument = new Document(absoluteHtmlPath, htmlLoadOptions))
                {
                    pdfDocument.Save(tempPdfFile);
                }

                byte[] fileBytes = System.IO.File.ReadAllBytes(tempPdfFile);
                return File(fileBytes, "application/pdf", "Resume.pdf");
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(500, "Internal Server Error: " + ex.Message);
            }
            finally
            {
                if (System.IO.File.Exists(absoluteHtmlPath))
                {
                    System.IO.File.Delete(absoluteHtmlPath);
                }
            }
        }

        private string RenderViewToString(ControllerContext context, string viewPath, object model = null)
        {
            ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindView(context, viewPath, null);
                var viewContext = new ViewContext(context, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                return sw.GetStringBuilder().ToString();
            }
        }

    }
}

