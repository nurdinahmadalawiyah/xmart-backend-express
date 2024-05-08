import redisClient from "../redis/redisClient.js";
import Transaksi from "../models/transaksi.js";
import {connectDBPostgre} from "../config/db.js";

const resolvers = {
    getTransaksi: async ({ qrCode }) => {
        try {
            let transaksiDocuments;

            const redisData = await redisClient.get(qrCode);
            if (redisData) {
                transaksiDocuments = JSON.parse(redisData);
            } else {
                transaksiDocuments = await Transaksi.find({ qrcode: qrCode });
                await redisClient.setEx(qrCode, 3600, JSON.stringify(transaksiDocuments));
            }

            return transaksiDocuments.map(doc => ({
                qrcode: doc.qrcode,
                rfid: doc.rfid,
                hargaSatuan: doc.harga_satuan,
                jumlah: doc.jumlah,
                tanggalJam: doc.tanggal_jam
            }));
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            throw new Error('Failed to fetch transactions');
        }
    },
    saveTransaksi: async ({qrcode, transaksi}) => {
        try {
            // Simpan transaksi ke MongoDB
            const transaksiDocuments = transaksi.map((barang) => ({
                qrcode,
                rfid: barang.rfid,
                harga_satuan: barang.hargaSatuan,
                jumlah: barang.jumlah,
                tanggal_jam: new Date()
            }));
            await Transaksi.insertMany(transaksiDocuments);

            // Check-in barang ke Redis
            await redisClient.setEx(qrcode, 3600, JSON.stringify(transaksiDocuments));

            // Transfer data transaksi dari MongoDB ke PostgreSQL menggunakan sequelize
            const client = await connectDBPostgre(); // Gunakan connectDBPostgre() untuk mendapatkan klien PostgreSQL
            await client.query('BEGIN');
            for (const detail of transaksiDocuments) {
                await client.query('INSERT INTO transaksi (qrcode, rfid, harga_satuan, jumlah, tanggal_jam) VALUES ($1, $2, $3, $4, $5)', [
                    detail.qrcode,
                    detail.rfid,
                    detail.harga_satuan,
                    detail.jumlah,
                    detail.tanggal_jam
                ]);
            }
            await client.query('COMMIT');

            return {success: true, message: "Transaksi berhasil diselesaikan"};
        } catch (error) {
            console.error(error)
            await Transaksi.deleteMany({qrcode});
            await redisClient.del(qrcode);
            return {success: false, message: "Gagal menyelesaikan transaksi"};
        }
    }
}

export default resolvers;