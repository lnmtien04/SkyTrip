// src/components/Footer.tsx
'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SkyTrip</h3>
            <p className="text-gray-400">Khám phá Việt Nam cùng chúng tôi</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@skytrip.vn</li>
              <li>Điện thoại: 1900 1234</li>
              <li>Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Chính sách</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Điều khoản sử dụng</li>
              <li>Chính sách bảo mật</li>
              <li>Quy định thanh toán</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Mạng xã hội</h4>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SkyTrip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}