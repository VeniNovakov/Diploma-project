const ProductPage = () => {
  return (
    <div className="flex flex-row h-max-screen">
      <Additions/>
    </div>
  ) 
}

const Additions = () => {
  return (
    <div>

    </div>
  )
}

const AdditionsSection = ({sectionType, additions}) => {
  return (
    <div>
      <label id={sectionType.id}>{sectionType.name}</label>
      <div>
        {
        additions.map(addition => {
          <Addition key={addition.id} addition={addition}/>
        }
        )
        }
      </div>
    </div>
  )
}
const Addition = () => {
  return (
    <div></div>
  )
}
//all important things for a product(name, desc, price)
const Product = () => {
  return (
    <div></div>
  )
}

export default ProductPage