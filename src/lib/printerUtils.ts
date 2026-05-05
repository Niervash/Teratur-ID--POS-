import { toast } from 'sonner';
import { BluetoothPrinter } from '@kduma-autoid/capacitor-bluetooth-printer';

/**
 * Printer Utility for Thermal Receipts (MP-58n / 58mm)
 * Uses Capacitor Bluetooth Printer for Android.
 */

const formatLine = (left: string, right: string, width: number = 32) => {
  const spaceCount = width - (left.length + right.length);
  return left + ' '.repeat(Math.max(0, spaceCount)) + right;
};

const divider = '-'.repeat(32);

export const printReceipt = async (transactionData: any) => {
  console.log('[Printer] Printing transaction:', transactionData);
  
  // Fetch dynamic settings from localStorage or fallback to default
  const savedData = localStorage.getItem('teratur_business_data');
  const business = savedData ? JSON.parse(savedData) : {
    name: 'TERATUR POS',
    address: 'Jl. Teknologi Pintar No. 42',
    phone: '0812-3456-7890',
    receiptHeader: 'Terima kasih telah berkunjung!',
    receiptFooter: 'Barang yang sudah dibeli tidak dapat ditukar',
    paperSize: '58mm'
  };

  const isNative = (window as any).Capacitor?.isNativePlatform();
  const lineWidth = business.paperSize === '80mm' ? 48 : 32;
  const currentDivider = '-'.repeat(lineWidth);

  if (isNative) {
    try {
      let receiptText = "";
      receiptText += "\x1b\x61\x01"; // Center align
      receiptText += `${business.name.toUpperCase()}\n`;
      receiptText += `${business.address}\n`;
      receiptText += `${business.phone}\n`;
      receiptText += currentDivider + "\n";
      
      if (business.receiptHeader) {
        receiptText += `${business.receiptHeader}\n`;
        receiptText += currentDivider + "\n";
      }
      
      receiptText += "\x1b\x61\x00"; // Left align
      receiptText += formatLine(`No: ${transactionData.id?.substring(0,10)}`, new Date().toLocaleDateString('id-ID'), lineWidth) + "\n";
      receiptText += `Kasir: ${transactionData.cashier || 'Admin'}\n`;
      receiptText += currentDivider + "\n";
      
      transactionData.items.forEach((item: any) => {
        receiptText += `${item.product.name}\n`;
        receiptText += formatLine(`${item.quantity} x ${item.product.sellingPrice.toLocaleString()}`, (item.product.sellingPrice * item.quantity).toLocaleString(), lineWidth) + "\n";
      });
      
      receiptText += currentDivider + "\n";
      receiptText += formatLine("TOTAL", `Rp ${transactionData.total.toLocaleString()}`, lineWidth) + "\n";
      receiptText += formatLine(`Bayar (${transactionData.method})`, `Rp ${transactionData.received.toLocaleString()}`, lineWidth) + "\n";
      receiptText += formatLine("Kembali", `Rp ${transactionData.change.toLocaleString()}`, lineWidth) + "\n";
      
      receiptText += currentDivider + "\n";
      receiptText += "\x1b\x61\x01"; // Center align
      if (business.receiptFooter) {
        receiptText += `${business.receiptFooter}\n`;
      }
      receiptText += "Powered by Teratur.id\n\n\n\n";
      receiptText += "\x1d\x56\x00"; 

      toast.info("Menghubungkan ke printer...");
      await BluetoothPrinter.print({ content: receiptText });
      toast.success("Struk berhasil dicetak");
      
    } catch (error: any) {
      console.error('Print Error:', error);
      toast.error("Gagal cetak: " + (error.message || "Periksa printer"));
    }
  } else {
    // Web Fallback
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const receiptHTML = `
        <html>
          <head>
            <style>
              @page { size: ${business.paperSize === '80mm' ? '80mm' : '58mm'} auto; margin: 0; }
              body { 
                font-family: 'Courier New', Courier, monospace; 
                width: ${business.paperSize === '80mm' ? '80mm' : '58mm'}; 
                padding: 5mm; 
                font-size: 12px;
                line-height: 1.2;
              }
              .text-center { text-align: center; }
              .divider { border-bottom: 1px dashed #000; margin: 5px 0; }
              .flex { display: flex; justify-content: space-between; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="text-center">
              <h3 style="margin:0">${business.name}</h3>
              <p style="margin:0; font-size: 10px;">${business.address}</p>
              <p style="margin:0; font-size: 10px;">${business.phone}</p>
            </div>
            <div class="divider"></div>
            <div class="text-center" style="font-size: 10px;">${business.receiptHeader}</div>
            <div class="divider"></div>
            <div class="flex" style="font-size: 10px;">
              <span>${transactionData.id?.substring(0,12) || 'TRX-NEW'}</span>
              <span>${new Date().toLocaleDateString('id-ID')}</span>
            </div>
            <div class="divider"></div>
            ${transactionData.items.map((item: any) => `
              <div style="margin-bottom: 4px;">
                <div>${item.product.name}</div>
                <div class="flex">
                  <span>${item.quantity} x ${item.product.sellingPrice.toLocaleString()}</span>
                  <span>${(item.product.sellingPrice * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            `).join('')}
            <div class="divider"></div>
            <div class="flex" style="font-weight: bold;">
              <span>TOTAL</span>
              <span>Rp ${transactionData.total.toLocaleString()}</span>
            </div>
            <div class="divider"></div>
            <div class="text-center" style="font-size: 10px;">
              <p>${business.receiptFooter}</p>
              <p>Powered by Teratur.id</p>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
    }
  }
};
