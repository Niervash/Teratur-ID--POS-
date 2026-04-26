import { toast } from 'sonner';

/**
 * Printer Utility for Thermal Receipts
 * Designed to work with Capacitor plugins like @kduma-autoid/capacitor-bluetooth-printer
 * or simply via Web Print API as fallback.
 */
export const printReceipt = async (transactionData: any) => {
  console.log('[Printer] Printing transaction:', transactionData);
  
  // Fallback to browser print if not on native
  const isNative = (window as any).Capacitor?.isNativePlatform();

  if (isNative) {
    // This is where you would call:
    // BluetoothPrinter.print({ content: formatReceipt(transactionData) })
    toast.info("Mencetak via Bluetooth Printer...");
  } else {
    // Simulate web print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const receiptHTML = `
        <html>
          <head>
            <style>
              body { font-family: 'Courier New', Courier, monospace; width: 80mm; padding: 10px; }
              .text-center { text-align: center; }
              .hr { border-bottom: 1px dashed #000; margin: 10px 0; }
              .flex { display: flex; justify-content: space-between; }
              .font-bold { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="text-center">
              <h2 style="margin:0">TERATUR POS</h2>
              <p style="margin:0">Jl. Teknologi Pintar No. 42</p>
              <p style="margin:0">0812-3456-7890</p>
            </div>
            <div class="hr"></div>
            <div class="flex">
              <span>No: ${transactionData.id || 'TRX-' + Date.now()}</span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
            <div class="flex">
              <span>Kasir: ${transactionData.cashier || 'Admin'}</span>
            </div>
            <div class="hr"></div>
            ${transactionData.items.map((item: any) => `
              <div class="flex">
                <span>${item.product.name} x${item.quantity}</span>
                <span>${(item.product.sellingPrice * item.quantity).toLocaleString()}</span>
              </div>
            `).join('')}
            <div class="hr"></div>
            <div class="flex font-bold">
              <span>TOTAL</span>
              <span>Rp ${transactionData.total.toLocaleString()}</span>
            </div>
            <div class="flex">
              <span>Bayar (${transactionData.method})</span>
              <span>Rp ${transactionData.received.toLocaleString()}</span>
            </div>
            <div class="flex">
              <span>Kembali</span>
              <span>Rp ${transactionData.change.toLocaleString()}</span>
            </div>
            <div class="hr"></div>
            <div class="text-center">
              <p>Terima Kasih Atas Kunjungan Anda!</p>
              <p>Powered by Teratur.id</p>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
    }
  }
};
