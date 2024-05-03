import mongoose from "mongoose";

const transaksiSchema = new mongoose.Schema({
    qrcode: String,
    rfid: String,
    harga_satuan: Number,
    jumlah: Number,
    tanggal_jam: {type: Date, default: Date.now}
})

const Transaksi = mongoose.model('Transaksi', transaksiSchema)

export default Transaksi;
