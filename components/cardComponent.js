import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Link from "next/link";
function CardComp({ item }) {
  return (
    <Card style={{ width: "18rem" }}>
      {/* <Card.Img variant="top" src={item.img} /> */}
      <Card.Body>
        <Card.Title>
          <h5>{item.option}</h5>
        </Card.Title>
        <Card.Text>{item.summary}</Card.Text>
        <Button className="my-2 w-100 btn-sm btn2">
          <Link className="cardLink" href={item.links[0]}>
            {item.btn[0]}
          </Link>
        </Button>
        <Button className="my-2 w-100 btn-sm btn2" variant="secondary">
          <Link className="cardLink" href={item.links[1]}>
            {item.btn[1]}
          </Link>
        </Button>
        <Button className="my-2 w-100 btn-sm btn2">
          <Link className="cardLink" href={item.links[2]}>
            {item.btn[2]}
          </Link>
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CardComp;
