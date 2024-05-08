import {buildSchema} from "graphql";

const schema = buildSchema(`
    scalar Date
    
    type Transaksi {
        qrcode: String!
        rfid: String!
        hargaSatuan: Float!
        jumlah: Int!
        tanggalJam: Date!
    }
    
    input TransaksiInput {
        rfid: String!
        namaBarang: String!
        hargaSatuan: Float!
        jumlah: Int!
    }

    type CompleteTransactionResponse {
      success: Boolean!
      message: String!
    }
    
    type Query {
        getTransaksi(qrCode: String!): [Transaksi!]!
    }
    
    type Mutation {
        saveTransaksi(qrcode: String!, transaksi: [TransaksiInput!]!): CompleteTransactionResponse!
    }
`);

export default schema