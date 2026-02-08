
export default function HintBox() {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99] max-w-4xl w-full border border-gray-700 rounded-lg">
            <div className="absolute -top-12 left-0">
                <img src="/hint.png" alt="hint" className="h-14 w-14 object-cover" />
            </div>
            <div className="bg-gray-800 p-6">
                <h2 className="text-sm font-bold">Hint</h2>
                <p className="text-sm mt-2">
                    This is a hint for the question.
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse totam natus earum reprehenderit quaerat ut possimus quod! Tenetur assumenda tempora quas aut
                    <br />
                    <br />
                    officia quibusdam unde incidunt accusamus nulla esse, eaque praesentium inventore voluptatem cum dolores dicta consectetur iure culpa vel ullam soluta nobis.
                    <br />
                    <br />
                    Repudiandae officia distinctio tempora enim tenetur consectetur voluptates suscipit doloribus corporis deleniti
                    corrupti veniam neque exercitationem expedita nam animi error
                    blanditiis alias, vel aperiam
                    cum magnam labore
                    modi reprehenderit. Natus blanditiis similique, quia veritatis id velit voluptatem.
                </p>
            </div>
        </div>
    );
}
