import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from 'reactstrap'
import './App.css'

function App() {
  const [health, setHealth] = useState(null)
  const [info, setInfo] = useState(null)
  const [healthLoading, setHealthLoading] = useState(true)
  const [infoLoading, setInfoLoading] = useState(true)
  const [healthError, setHealthError] = useState('')
  const [infoError, setInfoError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadHealth() {
      try {
        const response = await fetch('http://localhost:4000/api/health', {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`)
        setHealth(await response.json())
      } catch (error) {
        if (error.name !== 'AbortError') setHealthError(error.message)
      } finally {
        if (!controller.signal.aborted) setHealthLoading(false)
      }
    }

    async function loadInfo() {
      try {
        const response = await fetch('http://localhost:4000/api/info', {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`)
        setInfo(await response.json())
      } catch (error) {
        if (error.name !== 'AbortError') setInfoError(error.message)
      } finally {
        if (!controller.signal.aborted) setInfoLoading(false)
      }
    }

    loadHealth()
    loadInfo()
    return () => controller.abort()
  }, [])

  return (
    <main className="app-shell">
      <Container className="py-5">
        <header className="page-header mb-4">
          <p className="eyebrow">Panel de estado · API REST</p>
          <h1>Taller IV</h1>
        </header>

        <section className="health-section mb-4" aria-label="Estado del servicio">
          <div className="health-panel">
            <div className="health-heading">
              <h4>Estado del servicio</h4>
              {health && <Badge color="success" pill>API disponible</Badge>}
            </div>
            {healthLoading ? (
              <div className="loading-line"><Spinner size="sm" /> Consultando estado...</div>
            ) : healthError ? (
              <Alert color="danger" className="mb-0">No se pudo consultar el estado: {healthError}</Alert>
            ) : (
              <p>{health?.message}</p>
            )}
          </div>
        </section>

        <Row className="align-items-stretch">
          <Col xs="12">
            <Card className="roster-card h-100">
              <CardHeader className="roster-header">
                <div>
                  <p className="eyebrow mb-1">Directorio académico</p>
                  <h2>Integrantes</h2>
                </div>
                {info && <Badge color="success" pill>API funcionando</Badge>}
              </CardHeader>
              <CardBody>
                {infoLoading ? (
                  <div className="loading-line"><Spinner size="sm" /> Cargando integrantes...</div>
                ) : infoError ? (
                  <Alert color="danger" className="mb-0">
                    No se pudieron cargar los integrantes. Verifica que el backend esté encendido en el puerto 4000. ({infoError})
                  </Alert>
                ) : (
                  <Table responsive hover className="roster-table mb-0">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Carrera</th>
                        <th>Materias aprobadas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {info?.integrantes.map((integrante) => (
                        <tr key={integrante.nombre}>
                          <td className="member-name">{integrante.nombre}</td>
                          <td>{integrante.edad}</td>
                          <td>{integrante.carrera}</td>
                          <td><Badge color="primary" className="subject-count">{integrante.materiasAprobadas}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default App
