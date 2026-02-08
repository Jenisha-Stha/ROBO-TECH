import React from 'react'

const PageHeader = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white font-oswald">
                        {title}
                    </h1>
                    <p className="text-xl mb-8 leading-relaxed font-medium text-gray-300">
                        {description}
                    </p>
                    {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-[#00D4FF] to-[#0099CC] hover:from-[#00B8E6] hover:to-[#007AA3] text-white px-8 py-4 text-lg font-bold shadow-lg shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 border border-cyan-400/30">
                    🚀 Launch Into Partnership!
                    <Rocket className="ml-2 w-5 h-5" />
                </Button>
            </div> */}
                </div>
            </div>
        </div>
    )
}

export default PageHeader