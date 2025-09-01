"use client"
import React from 'react';

const LogoCarousel = () => {
  return (
    <div className="bg-gray-100 mb-12">
      <div className="container mx-auto">
        <div className="flickity-slider flex space-x-4 overflow-hidden">
          <div className="flex-shrink-0 w-1/5 text-center">
            <div className="relative">
              <div className="aspect-w-3 aspect-h-1 bg-cover bg-center" style={{ backgroundImage: "url('//coitonic.com/cdn/shop/files/0_1zVT_HIhhSlY8ruP.png?v=1752921244')" }}>
                <img className="w-full h-auto" src="//coitonic.com/cdn/shop/files/0_1zVT_HIhhSlY8ruP.png?v=1752921244" alt="Logo 1" />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-1/5 text-center">
            <div className="relative">
              <div className="aspect-w-1 aspect-h-1 bg-cover bg-center" style={{ backgroundImage: "url('//coitonic.com/cdn/shop/files/s1FnhAYONODoxNkoC8xA.webp?v=1752921320')" }}>
                <img className="w-full h-auto" src="//coitonic.com/cdn/shop/files/s1FnhAYONODoxNkoC8xA.webp?v=1752921320" alt="Logo 2" />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-1/5 text-center">
            <div className="relative">
              <div className="aspect-w-2 aspect-h-1 bg-cover bg-center" style={{ backgroundImage: "url('//coitonic.com/cdn/shop/files/1-01-qznjjs7sjc4vp8k5m902i7gs7tlovjijl06gms6c14.webp?v=1752921487')" }}>
                <img className="w-full h-auto" src="//coitonic.com/cdn/shop/files/1-01-qznjjs7sjc4vp8k5m902i7gs7tlovjijl06gms6c14.webp?v=1752921487" alt="Logo 3" />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-1/5 text-center">
            <div className="relative">
              <div className="aspect-w-2 aspect-h-1 bg-cover bg-center" style={{ backgroundImage: "url('//coitonic.com/cdn/shop/files/11-01-01-r2htild0su78qp42zkei4z03l5j7qc1hall1njrp0o.webp?v=1752921488')" }}>
                <img className="w-full h-auto" src="//coitonic.com/cdn/shop/files/11-01-01-r2htild0su78qp42zkei4z03l5j7qc1hall1njrp0o.webp?v=1752921488" alt="Logo 4" />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-1/5 text-center">
            <div className="relative">
              <div className="aspect-w-2 aspect-h-1 bg-cover bg-center" style={{ backgroundImage: "url('//coitonic.com/cdn/shop/files/5-01-r2hthd6lvmirl0w95jb1ds5fo1kyok63gix83jl754.webp?v=1752921488')" }}>
                <img className="w-full h-auto" src="//coitonic.com/cdn/shop/files/5-01-r2hthd6lvmirl0w95jb1ds5fo1kyok63gix83jl754.webp?v=1752921488" alt="Logo 5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;
