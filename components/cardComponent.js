import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Link from "next/link";
function CardComp({ item }) {
  return (
    <Card className="card" style={{ width: "18rem" }}>
      {/* <Card.Img variant="top" src={item.img} /> */}
      <Card.Body>
        <Card.Title>
          <h5>{item.option}</h5>
        </Card.Title>
        <Card.Text className="summary my-3">{item.summary}</Card.Text>
        <div className="card-btnGroup">
          <Button className="my-2 w-100 btn-sm btn2">
            <Link className="cardLink" href={item.links[0]}>
              {item.btn[0]}
            </Link>
          </Button>
          {item.btn[1] ? (
            <>
              <Button className="my-2 w-100 btn-sm btn2" variant="secondary">
                <Link className="cardLink" href={item.links[1]}>
                  {item.btn[1]}
                </Link>
              </Button>
            </>
          ) : null}
          {item.btn[2] ? (
            <Button className="my-2 w-100 btn-sm btn2">
              <Link className="cardLink" href={item.links[2]}>
                {item.btn[2]}
              </Link>
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardComp;
